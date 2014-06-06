package org.jboss.forge.website.view;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.enterprise.context.ConversationScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import org.jboss.forge.website.SiteConstants;
import org.jboss.forge.website.model.Addon;
import org.jboss.forge.website.model.Addon.Category;
import org.jboss.forge.website.model.Document;
import org.jboss.forge.website.service.Downloader;
import org.jboss.forge.website.service.RepositoryService;
import org.ocpsoft.common.util.Strings;
import org.ocpsoft.urlbuilder.Address;
import org.ocpsoft.urlbuilder.AddressBuilder;

/**
 * Backing bean for Addon entities.
 * <p>
 * This class provides CRUD functionality for all Addon entities. It focuses purely on Java EE 6 standards (e.g.
 * <tt>&#64;ConversationScoped</tt> for state management, <tt>PersistenceContext</tt> for persistence,
 * <tt>CriteriaBuilder</tt> for searches) rather than introducing a CRUD framework or custom base class.
 */

@Named
@ConversationScoped
public class AddonBean implements Serializable
{
   private static final long serialVersionUID = -6749406839031709443L;

   @Inject
   private RepositoryService service;

   @Inject
   private transient Downloader downloader;

   private String addonId;
   private Addon addon;
   private List<Document> relatedDocuments;

   private List<Addon> addons;
   private String searchQuery;
   private Set<Category> categoryFilter;
   private List<Category> categories = Arrays.asList(Category.CORE, Category.COMMUNITY);

   public void load()
   {
      List<Addon> result = new ArrayList<>();
      List<Addon> addons = service.getAllAddons();
      for (Addon addon : addons)
      {
         if (Strings.isNullOrEmpty(searchQuery) || (addon.getName() != null && addon.getName().toLowerCase().contains(searchQuery.toLowerCase()))
                  || (addon.getDescription() != null && addon.getDescription().toLowerCase().contains(searchQuery.toLowerCase()))
                  || (addon.getAuthor() != null && addon.getAuthor().toLowerCase().contains(searchQuery.toLowerCase()))
                  || (addon.getTags() != null && addon.getTags().toLowerCase().contains(searchQuery.toLowerCase())))
         {
            if (categoryFilter == null || categoryFilter.isEmpty() || addon.getCategory() == null
                     || categoryFilter.contains(addon.getCategory()))
            {
               result.add(addon);
            }
         }
      }

      this.setAddons(result);
   }

   public void retrieve() throws IOException
   {
      if (addonId != null)
      {
         List<Addon> addons = service.getAllAddons();
         for (Addon addon : addons)
         {
            if (addonId.equalsIgnoreCase(addon.getId()))
            {
               this.addon = addon;
               break;
            }
         }
      }

      if (addon != null)
      {
         setRelatedDocuments(service.getRelatedDocuments(addon, 4));
      }
      else
      {
         FacesContext.getCurrentInstance().getExternalContext().dispatch("/404");
      }
   }

   public String getReadmeHTML()
   {
      Address address = AddressBuilder.begin().scheme("http").domain(SiteConstants.REDOCULOUS_DOMAIN)
               .path("/api/v1/serve")
               .query("repo", addon.getRepo())
               .query("ref", addon.getBranch())
               .query("path", "/README").build();

      String result = downloader.download(address.toString());

      if (Strings.isNullOrEmpty(result))
         result = "No Content";

      return result;
   }

   public String getSearchQuery()
   {
      return searchQuery;
   }

   public void setSearchQuery(String searchQuery)
   {
      this.searchQuery = searchQuery;
   }

   public String getAddonId()
   {
      return addonId;
   }

   public void setAddonId(String addonId)
   {
      this.addonId = addonId;
   }

   public Addon getAddon()
   {
      return addon;
   }

   public void setAddon(Addon addon)
   {
      this.addon = addon;
   }

   public List<Addon> getAddons()
   {
      return addons;
   }

   public void setAddons(List<Addon> addons)
   {
      this.addons = addons;
   }

   public List<Category> getCategories()
   {
      return categories;
   }

   public void setCategories(List<Category> categories)
   {
      this.categories = categories;
   }

   public Set<Category> getCategoryFilter()
   {
      return categoryFilter;
   }

   public void setCategoryFilter(Set<Category> categoryFilter)
   {
      this.categoryFilter = categoryFilter;
   }

   public List<Document> getRelatedDocuments()
   {
      return relatedDocuments;
   }

   public void setRelatedDocuments(List<Document> relatedDocuments)
   {
      this.relatedDocuments = relatedDocuments;
   }
}