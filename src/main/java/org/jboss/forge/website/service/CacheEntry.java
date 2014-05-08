/*
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */
package org.jboss.forge.website.service;

/**
 * @author <a href="mailto:lincolnbaxter@gmail.com">Lincoln Baxter, III</a>
 */
public class CacheEntry
{
   private final String content;
   private long time;

   public CacheEntry(String content, long time)
   {
      this.content = content;
      this.time = time;
   }

   public String getContent()
   {
      return content;
   }

   public long getTime()
   {
      return time;
   }

   public void invalidate()
   {
      time = 0l;
   }
}
