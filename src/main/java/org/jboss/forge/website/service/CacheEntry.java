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
   private final String address;

   public CacheEntry(String address, String content, long time)
   {
      assert address != null;
      assert content != null;

      this.address = address;
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

   public String getAddress()
   {
      return address;
   }
}
