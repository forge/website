/**
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

package org.jboss.forge.website.model;

/**
 * 
 * @author <a href="ggastald@redhat.com">George Gastaldi</a>
 */
public class Contributor
{
   private String login;
   private Long id;
   private String avatar_url;
   private String gravatar_id;
   private String url;
   private String html_url;
   private String type;
   private Long contributions;

   public String getLogin()
   {
      return login;
   }

   public void setLogin(String login)
   {
      this.login = login;
   }

   public Long getId()
   {
      return id;
   }

   public void setId(Long id)
   {
      this.id = id;
   }

   public String getAvatar_url()
   {
      return avatar_url;
   }

   public void setAvatar_url(String avatar_url)
   {
      this.avatar_url = avatar_url;
   }

   public String getGravatar_id()
   {
      return gravatar_id;
   }

   public void setGravatar_id(String gravatar_id)
   {
      this.gravatar_id = gravatar_id;
   }

   public String getUrl()
   {
      return url;
   }

   public void setUrl(String url)
   {
      this.url = url;
   }

   public String getHtml_url()
   {
      return html_url;
   }

   public void setHtml_url(String html_url)
   {
      this.html_url = html_url;
   }

   public String getType()
   {
      return type;
   }

   public void setType(String type)
   {
      this.type = type;
   }

   public Long getContributions()
   {
      return contributions;
   }

   public void setContributions(Long contributions)
   {
      this.contributions = contributions;
   }
}
