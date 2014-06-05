package org.jboss.forge.website.rest;

import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.jboss.forge.website.SiteConstants;
import org.jboss.forge.website.service.Downloader;
import org.ocpsoft.urlbuilder.Address;
import org.ocpsoft.urlbuilder.AddressBuilder;

import com.google.gson.Gson;

/**
 * @author <a href="mailto:lincolnbaxter@gmail.com">Lincoln Baxter, III</a>
 */
@Path("/v1/webhooks")
@Produces({ "application/xml", "application/json" })
public class HooksIntegrationService
{
   @Inject
   private Downloader downloader;

   @POST
   @Path("/cache_invalidate")
   public Response githubUpdateRepository(
            @QueryParam("repo") String repo,
            @FormParam("payload") String payload)
            throws Exception
   {
      if (payload != null)
      {
         Gson gson = new Gson();
         Map<?, ?> json = gson.fromJson(payload, Map.class);
         Map<?, ?> repository = (Map<?, ?>) json.get("repository");
         repo = (String) repository.get("url");
         if (repo.startsWith("http") && !repo.endsWith(".git"))
            repo = repo + ".git";
      }

      if (repo == null || repo.isEmpty())
      {
         return Response.status(Status.NOT_FOUND).build();
      }
      else
      {
         try (CloseableHttpClient client = HttpClientBuilder.create().build())
         {
            Address address = AddressBuilder.begin().scheme("http").domain(SiteConstants.REDOCULOUS_DOMAIN)
                     .path("/api/v1/manage").query("repo", repo).build();

            HttpResponse response = client.execute(new HttpPut(address.toString()));

            if (response.getStatusLine().getStatusCode() != 200)
               throw new IllegalStateException("failed! (server returned status code: "
                        + response.getStatusLine().getStatusCode() + ")");
         }
         catch (Exception e)
         {
            return Response.status(Status.INTERNAL_SERVER_ERROR)
                     .entity("Failed to purge Redoculous cache for repo: " + repo).build();
         }
         finally
         {
            downloader.invalidateCachesByAddress(".*repo=" + repo + ".*");
         }
      }
      return Response.status(Status.OK).build();
   }
}
