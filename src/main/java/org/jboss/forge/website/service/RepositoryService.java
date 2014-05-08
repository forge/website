/*
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */
package org.jboss.forge.website.service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import javax.inject.Inject;

import org.jboss.forge.website.SiteConstants;
import org.jboss.forge.website.model.Addon;
import org.jboss.forge.website.model.Addon.Category;
import org.jboss.forge.website.model.Document;
import org.yaml.snakeyaml.Yaml;

/**
 * @author <a href="mailto:lincolnbaxter@gmail.com">Lincoln Baxter, III</a>
 */
public class RepositoryService implements Serializable
{
   private static final long serialVersionUID = -5958264325903728496L;

   @Inject
   private Downloader downloader;

   public List<Addon> getAllAddons()
   {
      List<Addon> result = new ArrayList<>();

      List<Addon> community = fetchList(SiteConstants.ADDON_REPO_URL_COMMUNITY, Addon.class);
      for (Addon addon : community)
      {
         addon.setCategory(Category.COMMUNITY);
      }
      result.addAll(community);

      List<Addon> core = fetchList(SiteConstants.ADDON_REPO_URL_CORE, Addon.class);
      for (Addon addon : core)
      {
         addon.setCategory(Category.CORE);
      }
      result.addAll(core);

      return result;
   }

   public List<Addon> getRandomCommunityAddons(int count)
   {
      List<Addon> result = new ArrayList<>();
      List<Addon> addons = new ArrayList<>(fetchList(SiteConstants.ADDON_REPO_URL_COMMUNITY, Addon.class));

      Random random = new Random(System.currentTimeMillis());
      while (result.size() < count && !addons.isEmpty())
      {
         result.add(addons.remove(random.nextInt(addons.size())));
      }

      return result;
   }

   public List<Document> getAllDocuments()
   {
      List<Document> result = new ArrayList<>();

      List<Document> getStarted = fetchList(SiteConstants.DOCS_REPO_URL_GETSTARTED, Document.class);
      for (Document document : getStarted)
      {
         document.setCategory(org.jboss.forge.website.model.Document.Category.QUICKSTART);
      }
      result.addAll(getStarted);

      List<Document> tutorials = fetchList(SiteConstants.DOCS_REPO_URL_TUTORIALS, Document.class);
      for (Document document : tutorials)
      {
         document.setCategory(org.jboss.forge.website.model.Document.Category.TUTORIAL);
      }
      result.addAll(tutorials);

      List<Document> advanced = fetchList(SiteConstants.DOCS_REPO_URL_ADVANCED, Document.class);
      for (Document document : advanced)
      {
         document.setCategory(org.jboss.forge.website.model.Document.Category.ADVANCED);
      }
      result.addAll(advanced);

      return result;
   }

   public List<Document> getRelatedDocuments(Document document, int count)
   {
      List<Document> result = new ArrayList<>();
      List<Document> documents = getAllDocuments();

      Random random = new Random(System.currentTimeMillis());
      while (result.size() < count && !documents.isEmpty())
      {
         Document related = documents.remove(random.nextInt(documents.size()));
         if (document.getCategory() != null && document.getCategory().equals(related.getCategory()))
            result.add(related);
      }

      return result;
   }

   /*
    * Helpers
    */

   private <T> List<T> parse(String content, Class<T> type)
   {
      List<T> result = new ArrayList<>();

      if (content != null)
      {
         List<String> addonEntries = Arrays.asList(content.trim().split("---"));

         for (String addonEntry : addonEntries)
         {
            if (!addonEntry.trim().isEmpty())
            {
               T addon = new Yaml().loadAs(addonEntry, type);
               result.add(addon);
            }
         }
      }
      return result;
   }

   private <T> List<T> fetchList(String url, Class<T> type)
   {
      String content = downloader.download(url);

      List<T> result = null;
      if (content != null)
         result = parse(content, type);
      else
         new ArrayList<>();

      return result;
   }

}
