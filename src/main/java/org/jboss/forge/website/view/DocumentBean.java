package org.jboss.forge.website.view;

import java.io.Serializable;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.enterprise.context.ConversationScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.jboss.forge.website.model.Document;
import org.jboss.forge.website.model.Document.Category;
import org.jboss.forge.website.service.Downloader;
import org.jboss.forge.website.service.RepositoryService;
import org.ocpsoft.common.util.Strings;
import org.ocpsoft.urlbuilder.Address;
import org.ocpsoft.urlbuilder.AddressBuilder;

/**
 * Backing bean for Document entities.
 * <p>
 * This class provides CRUD functionality for all Document entities. It focuses purely on Java EE 6 standards (e.g.
 * <tt>&#64;ConversationScoped</tt> for state management, <tt>PersistenceContext</tt> for persistence,
 * <tt>CriteriaBuilder</tt> for searches) rather than introducing a CRUD framework or custom base class.
 */

@Named
@ConversationScoped
public class DocumentBean implements Serializable
{
   private static final long serialVersionUID = -1447177331142569029L;

   @Inject
   private Downloader downloader;

   @Inject
   private RepositoryService service;

   private String documentTitle;
   private Document document;
   private List<Document> relatedDocuments;

   private List<Document> documents;
   private String searchQuery;
   private Set<Category> categoryFilter;
   private List<Category> categories = Arrays.asList(Category.QUICKSTART, Category.TUTORIAL, Category.ADVANCED);

   public void load()
   {
      List<Document> result = new ArrayList<>();
      List<Document> documents = service.getAllDocuments();

      for (Document document : documents)
      {
         if (Strings.isNullOrEmpty(searchQuery) ||
                  (document.getTitle() != null && document.getTitle().contains(searchQuery))
                  || (document.getSummary() != null && document.getSummary().contains(searchQuery))
                  || (document.getAuthor() != null && document.getAuthor().contains(searchQuery)))
         {
            if (categoryFilter == null || categoryFilter.isEmpty() || document.getCategory() == null
                     || categoryFilter.contains(document.getCategory()))
            {
               result.add(document);
            }
         }

      }

      this.setDocuments(result);
   }

   public void retrieve()
   {
      if (documentTitle != null)
      {
         List<Document> documents = service.getAllDocuments();
         for (Document document : documents)
         {
            if (documentTitle.equals(document.getTitle()))
            {
               this.document = document;
               break;
            }
         }
      }

      if (document != null)
         setRelatedDocuments(service.getRelatedDocuments(document, 4));
   }

   public String getSearchQuery()
   {
      return searchQuery;
   }

   public void setSearchQuery(String searchQuery)
   {
      this.searchQuery = searchQuery;
   }

   public List<Document> getDocuments()
   {
      return documents;
   }

   public void setDocuments(List<Document> documents)
   {
      this.documents = documents;
   }

   public String getDocumentHTML() throws MalformedURLException
   {
      Address address = AddressBuilder.begin().scheme("http").domain("redoculous-lincolnbaxter.rhcloud.com")
               .path("/api/v1/serve")
               .query("repo", document.getRepo())
               .query("ref", document.getRef())
               .query("path", document.getPath()).build();

      String result = downloader.download(address.toString());

      if (Strings.isNullOrEmpty(result))
         result = "No Content";

      return result;
   }

   public String getDocumentToC() throws MalformedURLException
   {
      Address address = AddressBuilder.begin().scheme("http").domain("redoculous-lincolnbaxter.rhcloud.com")
               .path("/api/v1/serve/toc")
               .query("repo", document.getRepo())
               .query("ref", document.getRef())
               .query("path", document.getPath()).build();

      String result = downloader.download(address.toString());

      if (Strings.isNullOrEmpty(result))
         result = "No Content";

      return result;
   }

   public Set<Category> getCategoryFilter()
   {
      return categoryFilter;
   }

   public void setCategoryFilter(Set<Category> categoryFilter)
   {
      this.categoryFilter = categoryFilter;
   }

   public List<Category> getCategories()
   {
      return categories;
   }

   public void setCategories(List<Category> categories)
   {
      this.categories = categories;
   }

   public Document getDocument()
   {
      return this.document;
   }

   public String getDocumentTitle()
   {
      return documentTitle;
   }

   public void setDocumentTitle(String documentTitle)
   {
      this.documentTitle = documentTitle;
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