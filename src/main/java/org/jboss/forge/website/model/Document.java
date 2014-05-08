package org.jboss.forge.website.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Document implements Serializable
{
   public enum Category
   {
      TUTORIAL, QUICKSTART, ADVANCED
   }

   private static final long serialVersionUID = 1877899945613403201L;

   private String title;
   private String summary;
   private String repo;
   private String ref;
   private String path;
   private String author;
   private String email;
   private Category category;

   public String getTitle()
   {
      return title;
   }

   public void setTitle(String title)
   {
      this.title = title;
   }

   public String getSummary()
   {
      return summary;
   }

   public void setSummary(String summary)
   {
      this.summary = summary;
   }

   public String getRepo()
   {
      return repo;
   }

   public void setRepo(String repository)
   {
      this.repo = repository;
   }

   public String getRef()
   {
      return ref;
   }

   public void setRef(String ref)
   {
      this.ref = ref;
   }

   public String getPath()
   {
      return path;
   }

   public void setPath(String path)
   {
      this.path = path;
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
      result = prime * result + ((path == null) ? 0 : path.hashCode());
      result = prime * result + ((ref == null) ? 0 : ref.hashCode());
      result = prime * result + ((repo == null) ? 0 : repo.hashCode());
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
      Document other = (Document) obj;
      if (path == null)
      {
         if (other.path != null)
            return false;
      }
      else if (!path.equals(other.path))
         return false;
      if (ref == null)
      {
         if (other.ref != null)
            return false;
      }
      else if (!ref.equals(other.ref))
         return false;
      if (repo == null)
      {
         if (other.repo != null)
            return false;
      }
      else if (!repo.equals(other.repo))
         return false;
      return true;
   }

   @Override
   public String toString()
   {
      return repo + " " + ref + " " + path;
   }
}