package org.jboss.forge.website.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import javax.xml.bind.annotation.XmlRootElement;
import java.lang.Override;

@Entity
@XmlRootElement
public class Addon implements Serializable
{
   private static final long serialVersionUID = 1L;

   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
   @Column(name = "id", updatable = false, nullable = false)
   private Long id;

   @Version
   @Column(name = "version")
   private int version;

   @Column
   private String name;

   @Column
   private String description;

   @Column
   private String authorName;

   @Column
   @Temporal(TemporalType.DATE)
   private Date creationDate = new Date();

   @Column
   @Enumerated
   private AddonSource source;

   @Column
   @Enumerated
   private AddonStatus status = AddonStatus.PENDING;

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
      if (!(obj instanceof Addon))
      {
         return false;
      }
      Addon other = (Addon) obj;
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

   public String getName()
   {
      return this.name;
   }

   public void setName(final String groupId)
   {
      this.name = groupId;
   }

   public String getAuthorName()
   {
      return this.authorName;
   }

   public void setAuthorName(final String authorName)
   {
      this.authorName = authorName;
   }

   public Date getCreationDate()
   {
      return this.creationDate;
   }

   public void setCreationDate(final Date creationDate)
   {
      this.creationDate = creationDate;
   }

   public AddonSource getSource()
   {
      return this.source;
   }

   public void setSource(final AddonSource source)
   {
      this.source = source;
   }

   public AddonStatus getStatus()
   {
      return this.status;
   }

   public void setStatus(final AddonStatus status)
   {
      this.status = status;
   }

   public String getDescription()
   {
      return this.description;
   }

   public void setDescription(final String description)
   {
      this.description = description;
   }

   @Override
   public String toString()
   {
      String result = getClass().getSimpleName() + " ";
      result += "serialVersionUID: " + serialVersionUID;
      if (name != null && !name.trim().isEmpty())
         result += ", name: " + name;
      if (authorName != null && !authorName.trim().isEmpty())
         result += ", authorName: " + authorName;
      if (description != null && !description.trim().isEmpty())
         result += ", description: " + description;
      return result;
   }
}