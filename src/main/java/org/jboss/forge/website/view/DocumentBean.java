package org.jboss.forge.website.view;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.ejb.SessionContext;
import javax.ejb.Stateful;
import javax.enterprise.context.Conversation;
import javax.enterprise.context.ConversationScoped;
import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;
import javax.inject.Inject;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.jboss.forge.website.model.Document;
import org.ocpsoft.common.util.Streams;
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
@Stateful
@ConversationScoped
public class DocumentBean implements Serializable
{

   private static final long serialVersionUID = 1L;

   /*
    * Support creating and retrieving Document entities
    */

   private Long id;

   public Long getId()
   {
      return this.id;
   }

   public void setId(Long id)
   {
      this.id = id;
   }

   private Document document;

   public Document getDocument()
   {
      return this.document;
   }

   public String getDocumentHTML() throws MalformedURLException
   {
      Address address = AddressBuilder.begin().scheme("http").domain("redoculous-lincolnbaxter.rhcloud.com")
               .path("/api/v1/serve")
               .query("repo", document.getRepository())
               .query("ref", document.getRef())
               .query("path", document.getPath()).build();

      String result = "No Content";
      try (InputStream contentStream = new URL(address.toString()).openStream())
      {
         result = Streams.toString(contentStream);
      }
      catch (IOException e)
      {
         System.out.println(e);
      }

      return result;
   }

   @Inject
   private Conversation conversation;

   @PersistenceContext(unitName = "website-persistence-unit", type = PersistenceContextType.EXTENDED)
   private EntityManager entityManager;

   public String create()
   {

      this.conversation.begin();
      return "create?faces-redirect=true";
   }

   public void retrieve()
   {

      if (FacesContext.getCurrentInstance().isPostback())
      {
         return;
      }

      if (this.conversation.isTransient())
      {
         this.conversation.begin();
      }

      if (this.id == null)
      {
         this.document = this.example;
      }
      else
      {
         this.document = findById(getId());
      }
   }

   public Document findById(Long id)
   {

      return this.entityManager.find(Document.class, id);
   }

   /*
    * Support updating and deleting Document entities
    */

   public String update()
   {
      this.conversation.end();

      try
      {
         if (this.id == null)
         {
            this.entityManager.persist(this.document);
            return "search?faces-redirect=true";
         }
         else
         {
            this.entityManager.merge(this.document);
            return "view?faces-redirect=true&id=" + this.document.getId();
         }
      }
      catch (Exception e)
      {
         FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(e.getMessage()));
         return null;
      }
   }

   public String delete()
   {
      this.conversation.end();

      try
      {
         Document deletableEntity = findById(getId());

         this.entityManager.remove(deletableEntity);
         this.entityManager.flush();
         return "search?faces-redirect=true";
      }
      catch (Exception e)
      {
         FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(e.getMessage()));
         return null;
      }
   }

   /*
    * Support searching Document entities with pagination
    */

   private int page;
   private long count;
   private List<Document> pageItems;

   private Document example = new Document();

   public int getPage()
   {
      return this.page;
   }

   public void setPage(int page)
   {
      this.page = page;
   }

   public int getPageSize()
   {
      return 10;
   }

   public Document getExample()
   {
      return this.example;
   }

   public void setExample(Document example)
   {
      this.example = example;
   }

   public void search()
   {
      this.page = 0;
   }

   public void paginate()
   {

      CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();

      // Populate this.count

      CriteriaQuery<Long> countCriteria = builder.createQuery(Long.class);
      Root<Document> root = countCriteria.from(Document.class);
      countCriteria = countCriteria.select(builder.count(root)).where(
               getSearchPredicates(root));
      this.count = this.entityManager.createQuery(countCriteria)
               .getSingleResult();

      // Populate this.pageItems

      CriteriaQuery<Document> criteria = builder.createQuery(Document.class);
      root = criteria.from(Document.class);
      TypedQuery<Document> query = this.entityManager.createQuery(criteria
               .select(root).where(getSearchPredicates(root)));
      query.setFirstResult(this.page * getPageSize()).setMaxResults(
               getPageSize());
      this.pageItems = query.getResultList();
   }

   private Predicate[] getSearchPredicates(Root<Document> root)
   {

      CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
      List<Predicate> predicatesList = new ArrayList<>();

      String repository = this.example.getRepository();
      if (repository != null && !"".equals(repository))
      {
         predicatesList.add(builder.like(builder.lower(root.<String> get("repository")),
                  '%' + repository.toLowerCase() + '%'));
      }
      String ref = this.example.getRef();
      if (ref != null && !"".equals(ref))
      {
         predicatesList.add(builder.like(builder.lower(root.<String> get("ref")), '%' + ref.toLowerCase() + '%'));
      }
      String path = this.example.getPath();
      if (path != null && !"".equals(path))
      {
         predicatesList.add(builder.like(builder.lower(root.<String> get("path")), '%' + path.toLowerCase() + '%'));
      }

      return predicatesList.toArray(new Predicate[predicatesList.size()]);
   }

   public List<Document> getPageItems()
   {
      return this.pageItems;
   }

   public long getCount()
   {
      return this.count;
   }

   /*
    * Support listing and POSTing back Document entities (e.g. from inside an HtmlSelectOneMenu)
    */

   public List<Document> getAll()
   {

      CriteriaQuery<Document> criteria = this.entityManager
               .getCriteriaBuilder().createQuery(Document.class);
      return this.entityManager.createQuery(
               criteria.select(criteria.from(Document.class))).getResultList();
   }

   @Resource
   private SessionContext sessionContext;

   public Converter getConverter()
   {

      final DocumentBean ejbProxy = this.sessionContext.getBusinessObject(DocumentBean.class);

      return new Converter()
      {

         @Override
         public Object getAsObject(FacesContext context,
                  UIComponent component, String value)
         {

            return ejbProxy.findById(Long.valueOf(value));
         }

         @Override
         public String getAsString(FacesContext context,
                  UIComponent component, Object value)
         {

            if (value == null)
            {
               return "";
            }

            return String.valueOf(((Document) value).getId());
         }
      };
   }

   /*
    * Support adding children to bidirectional, one-to-many tables
    */

   private Document add = new Document();

   public Document getAdd()
   {
      return this.add;
   }

   public Document getAdded()
   {
      Document added = this.add;
      this.add = new Document();
      return added;
   }
}