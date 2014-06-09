package org.jboss.forge.website.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import org.ocpsoft.common.util.Strings;

@XmlRootElement
public class Addon implements Serializable
{
   private static final long serialVersionUID = 1L;

   public enum Category
   {
      CORE, COMMUNITY
   }

   private String id;
   private String name;
   private String description;
   private String author;
   private String email;
   private String website;
   private String repo;
   private String branch;
   private String tags;
   private String logo;
   private Category category;

   public String getId()
   {
      return id;
   }

   public void setId(String id)
   {
      this.id = id;
   }

   public String getName()
   {
      return name;
   }

   public void setName(String name)
   {
      this.name = name;
   }

   public String getDescription()
   {
      return description;
   }

   public void setDescription(String description)
   {
      this.description = description;
   }

   public String getAuthor()
   {
      return author;
   }

   public void setAuthor(String author)
   {
      this.author = author;
   }

   public String getEmail()
   {
      return email;
   }

   public void setEmail(String email)
   {
      this.email = email;
   }

   public String getWebsite()
   {
      return website;
   }

   public void setWebsite(String website)
   {
      this.website = website;
   }

   public String getRepo()
   {
      return repo;
   }

   public void setRepo(String repo)
   {
      this.repo = repo;
   }

   public String getBranch()
   {
      return branch;
   }

   public void setBranch(String branch)
   {
      this.branch = branch;
   }

   public String getTags()
   {
      return tags;
   }

   public void setTags(String tags)
   {
      this.tags = tags;
   }
   
   public String getLogo()
   {
      return Strings.isNullOrEmpty(logo) ? "resources/images/forge-logo.png" : logo;
   }
   
   public void setLogo(String logo)
   {
      this.logo = logo;
   }

   public Category getCategory()
   {
      return category;
   }

   public void setCategory(Category category)
   {
      this.category = category;
   }

   @Override
   public int hashCode()
   {
      final int prime = 31;
      int result = 1;
      result = prime * result + ((id == null) ? 0 : id.hashCode());
      return result;
   }

   @Override
   public boolean equals(Object obj)
   {
      if (this == obj)
         return true;
      if (obj == null)
         return false;
      if (getClass() != obj.getClass())
         return false;
      Addon other = (Addon) obj;
      if (id == null)
      {
         if (other.id != null)
            return false;
      }
      else if (!id.equals(other.id))
         return false;
      return true;
   }

   @Override
   public String toString()
   {
      return id;
   }

}