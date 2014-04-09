package org.jboss.forge.website.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "documents")
@XmlRootElement
public class Document implements Serializable
{
   private static final long serialVersionUID = 1877899945613403201L;

   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
   @Column(name = "id", updatable = false, nullable = false)
   private Long id = null;
   @Version
   @Column(name = "version")
   private int version = 0;

   @Column
   private String repository;

   @Column
   private String ref;

   @Column
   private String path;

   @Column
   private String title;

   @Column
   private String description;

   @Enumerated(EnumType.ORDINAL)
   private DocumentCategory category;

   public Long getId()
   {
      return this.id;
   }

   public void setId(final Long id)
   {
      this.id = id;
   }

   public int getVersion()
   {
      return this.version;
   }

   public void setVersion(final int version)
   {
      this.version = version;
   }

   @Override
   public boolean equals(Object obj)
   {
      if (this == obj)
      {
         return true;
      }
      if (!(obj instanceof Document))
      {
         return false;
      }
      Document other = (Document) obj;
      if (id != null)
      {
         if (!id.equals(other.id))
         {
            return false;
         }
      }
      return true;
   }

   @Override
   public int hashCode()
   {
      final int prime = 31;
      int result = 1;
      result = prime * result + ((id == null) ? 0 : id.hashCode());
      return result;
   }

   public String getRepository()
   {
      return this.repository;
   }

   public void setRepository(final String repository)
   {
      this.repository = repository;
   }

   public String getRef()
   {
      return this.ref;
   }

   public void setRef(final String ref)
   {
      this.ref = ref;
   }

   public String getPath()
   {
      return this.path;
   }

   public void setPath(final String path)
   {
      this.path = path;
   }

   @Override
   public String toString()
   {
      String result = getClass().getSimpleName() + " ";
      if (repository != null && !repository.trim().isEmpty())
         result += "repository: " + repository;
      if (ref != null && !ref.trim().isEmpty())
         result += ", ref: " + ref;
      if (path != null && !path.trim().isEmpty())
         result += ", path: " + path;
      return result;
   }

   public String getTitle()
   {
      return title;
   }

   public void setTitle(String title)
   {
      this.title = title;
   }

   public String getDescription()
   {
      return description;
   }

   public void setDescription(String description)
   {
      this.description = description;
   }

   public DocumentCategory getCategory()
   {
      return category;
   }

   public void setCategory(DocumentCategory category)
   {
      this.category = category;
   }
}