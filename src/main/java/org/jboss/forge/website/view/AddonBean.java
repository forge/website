package org.jboss.forge.website.view;

import java.io.Serializable;
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

import org.jboss.forge.website.model.Addon;

/**
 * Backing bean for Addon entities.
 * <p>
 * This class provides CRUD functionality for all Addon entities. It focuses
 * purely on Java EE 6 standards (e.g. <tt>&#64;ConversationScoped</tt> for
 * state management, <tt>PersistenceContext</tt> for persistence,
 * <tt>CriteriaBuilder</tt> for searches) rather than introducing a CRUD framework or
 * custom base class.
 */

@Named
@Stateful
@ConversationScoped
public class AddonBean implements Serializable
{

   private static final long serialVersionUID = 1L;

   /*
    * Support creating and retrieving Addon entities
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

   private Addon addon;

   public Addon getAddon()
   {
      return this.addon;
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
         this.addon = this.example;
      }
      else
      {
         this.addon = findById(getId());
      }
   }

   public Addon findById(Long id)
   {

      return this.entityManager.find(Addon.class, id);
   }

   /*
    * Support updating and deleting Addon entities
    */

   public String update()
   {
      this.conversation.end();

      try
      {
         if (this.id == null)
         {
            this.entityManager.persist(this.addon);
            return "search?faces-redirect=true";
         }
         else
         {
            this.entityManager.merge(this.addon);
            return "view?faces-redirect=true&id=" + this.addon.getId();
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
         Addon deletableEntity = findById(getId());

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
    * Support searching Addon entities with pagination
    */

   private int page;
   private long count;
   private List<Addon> pageItems;

   private Addon example = new Addon();

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

   public Addon getExample()
   {
      return this.example;
   }

   public void setExample(Addon example)
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
      Root<Addon> root = countCriteria.from(Addon.class);
      countCriteria = countCriteria.select(builder.count(root)).where(
            getSearchPredicates(root));
      this.count = this.entityManager.createQuery(countCriteria)
            .getSingleResult();

      // Populate this.pageItems

      CriteriaQuery<Addon> criteria = builder.createQuery(Addon.class);
      root = criteria.from(Addon.class);
      TypedQuery<Addon> query = this.entityManager.createQuery(criteria
            .select(root).where(getSearchPredicates(root)));
      query.setFirstResult(this.page * getPageSize()).setMaxResults(
            getPageSize());
      this.pageItems = query.getResultList();
   }

   private Predicate[] getSearchPredicates(Root<Addon> root)
   {

      CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
      List<Predicate> predicatesList = new ArrayList<Predicate>();

      String groupId = this.example.getGroupId();
      if (groupId != null && !"".equals(groupId))
      {
         predicatesList.add(builder.like(builder.lower(root.<String> get("groupId")), '%' + groupId.toLowerCase() + '%'));
      }
      String artifactId = this.example.getArtifactId();
      if (artifactId != null && !"".equals(artifactId))
      {
         predicatesList.add(builder.like(builder.lower(root.<String> get("artifactId")), '%' + artifactId.toLowerCase() + '%'));
      }
      String addonVersion = this.example.getAddonVersion();
      if (addonVersion != null && !"".equals(addonVersion))
      {
         predicatesList.add(builder.like(builder.lower(root.<String> get("addonVersion")), '%' + addonVersion.toLowerCase() + '%'));
      }

      return predicatesList.toArray(new Predicate[predicatesList.size()]);
   }

   public List<Addon> getPageItems()
   {
      return this.pageItems;
   }

   public long getCount()
   {
      return this.count;
   }

   /*
    * Support listing and POSTing back Addon entities (e.g. from inside an
    * HtmlSelectOneMenu)
    */

   public List<Addon> getAll()
   {

      CriteriaQuery<Addon> criteria = this.entityManager
            .getCriteriaBuilder().createQuery(Addon.class);
      return this.entityManager.createQuery(
            criteria.select(criteria.from(Addon.class))).getResultList();
   }

   @Resource
   private SessionContext sessionContext;

   public Converter getConverter()
   {

      final AddonBean ejbProxy = this.sessionContext.getBusinessObject(AddonBean.class);

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

            return String.valueOf(((Addon) value).getId());
         }
      };
   }

   /*
    * Support adding children to bidirectional, one-to-many tables
    */

   private Addon add = new Addon();

   public Addon getAdd()
   {
      return this.add;
   }

   public Addon getAdded()
   {
      Addon added = this.add;
      this.add = new Addon();
      return added;
   }
}