package org.jboss.forge.website.rest;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;
import org.jboss.forge.website.model.Document;

/**
 * 
 */
@Stateless
@Path("/documents")
public class DocumentEndpoint
{
   @PersistenceContext(unitName = "website-persistence-unit")
   private EntityManager em;

   @POST
   @Consumes("application/json")
   public Response create(Document entity)
   {
      em.persist(entity);
      return Response.created(UriBuilder.fromResource(DocumentEndpoint.class).path(String.valueOf(entity.getId())).build()).build();
   }

   @DELETE
   @Path("/{id:[0-9][0-9]*}")
   public Response deleteById(@PathParam("id") Long id)
   {
      Document entity = em.find(Document.class, id);
      if (entity == null)
      {
         return Response.status(Status.NOT_FOUND).build();
      }
      em.remove(entity);
      return Response.noContent().build();
   }

   @GET
   @Path("/{id:[0-9][0-9]*}")
   @Produces("application/json")
   public Response findById(@PathParam("id") Long id)
   {
      TypedQuery<Document> findByIdQuery = em.createQuery("SELECT DISTINCT d FROM Document d WHERE d.id = :entityId ORDER BY d.id", Document.class);
      findByIdQuery.setParameter("entityId", id);
      Document entity;
      try
      {
         entity = findByIdQuery.getSingleResult();
      }
      catch (NoResultException nre)
      {
         entity = null;
      }
      if (entity == null)
      {
         return Response.status(Status.NOT_FOUND).build();
      }
      return Response.ok(entity).build();
   }

   @GET
   @Produces("application/json")
   public List<Document> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult)
   {
      TypedQuery<Document> findAllQuery = em.createQuery("SELECT DISTINCT d FROM Document d ORDER BY d.id", Document.class);
      if (startPosition != null)
      {
         findAllQuery.setFirstResult(startPosition);
      }
      if (maxResult != null)
      {
         findAllQuery.setMaxResults(maxResult);
      }
      final List<Document> results = findAllQuery.getResultList();
      return results;
   }

   @PUT
   @Path("/{id:[0-9][0-9]*}")
   @Consumes("application/json")
   public Response update(Document entity)
   {
      entity = em.merge(entity);
      return Response.noContent().build();
   }
}