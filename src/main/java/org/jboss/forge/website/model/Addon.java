package org.jboss.forge.website.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;
import java.lang.Override;
import javax.xml.bind.annotation.XmlRootElement;

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
   private String groupId;

   @Column
   private String artifactId;

   @Column
   private String addonVersion;

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

   public String getGroupId()
   {
      return this.groupId;
   }

   public void setGroupId(final String groupId)
   {
      this.groupId = groupId;
   }

   public String getArtifactId()
   {
      return this.artifactId;
   }

   public void setArtifactId(final String artifactId)
   {
      this.artifactId = artifactId;
   }

   public String getAddonVersion()
   {
      return this.addonVersion;
   }

   public void setAddonVersion(final String addonVersion)
   {
      this.addonVersion = addonVersion;
   }

   @Override
   public String toString()
   {
      String result = getClass().getSimpleName() + " ";
      result += "serialVersionUID: " + serialVersionUID;
      if (groupId != null && !groupId.trim().isEmpty())
         result += ", groupId: " + groupId;
      if (artifactId != null && !artifactId.trim().isEmpty())
         result += ", artifactId: " + artifactId;
      if (addonVersion != null && !addonVersion.trim().isEmpty())
         result += ", addonVersion: " + addonVersion;
      return result;
   }
}