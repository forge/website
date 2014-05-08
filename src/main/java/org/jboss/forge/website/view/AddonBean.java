package org.jboss.forge.website.view;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.enterprise.context.ConversationScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.jboss.forge.website.model.Addon;
import org.jboss.forge.website.model.Addon.Category;
import org.jboss.forge.website.service.RepositoryService;
import org.ocpsoft.common.util.Strings;

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
   private static final long serialVersionUID = 1L;

   @Inject
   private RepositoryService service;

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
         if (Strings.isNullOrEmpty(searchQuery) || (addon.getName() != null && addon.getName().contains(searchQuery))
                  || (addon.getDescription() != null && addon.getDescription().contains(searchQuery))
                  || (addon.getAuthor() != null && addon.getAuthor().contains(searchQuery))
                  || (addon.getTags() != null && addon.getTags().contains(searchQuery)))
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

   public String getSearchQuery()
   {
      return searchQuery;
   }

   public void setSearchQuery(String searchQuery)
   {
      this.searchQuery = searchQuery;
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
}