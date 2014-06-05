/**
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

package org.jboss.forge.website.rest;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.jboss.forge.website.model.Addon;
import org.jboss.forge.website.service.RepositoryService;

/**
 * 
 * @author <a href="ggastald@redhat.com">George Gastaldi</a>
 */
@Path("/v1/addons")
public class AddonInstallationService
{
   @Inject
   RepositoryService repository;

   @GET
   @Path("/{id}")
   @Produces(MediaType.APPLICATION_JSON)
   public Addon getAddon(@PathParam("id") String addonId)
   {
      List<Addon> allAddons = repository.getAllAddons();
      for (Addon addon : allAddons)
      {
         if (addon.getId().equals(addonId))
         {
            return addon;
         }
      }
      return null;
   }

   @GET
   @Produces(MediaType.APPLICATION_JSON)
   public List<Addon> findAddon(@QueryParam("q") String term)
   {
      List<Addon> allAddons = repository.getAllAddons();
      List<Addon> foundAddons = new ArrayList<>();
      for (Addon addon : allAddons)
      {
         if (addon.getId().contains(term) || addon.getName().contains(term) || addon.getTags().contains(term))
         {
            foundAddons.add(addon);
         }
      }
      return foundAddons;
   }
}
