/*
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */
package org.jboss.forge.website.rewrite;

import javax.inject.Inject;
import javax.servlet.ServletContext;

import org.jboss.forge.website.service.Downloader;
import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.context.EvaluationContext;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.HttpOperation;
import org.ocpsoft.rewrite.servlet.config.Path;
import org.ocpsoft.rewrite.servlet.config.SendStatus;
import org.ocpsoft.rewrite.servlet.http.event.HttpServletRewrite;

/**
 * @author <a href="mailto:lincolnbaxter@gmail.com">Lincoln Baxter, III</a>
 */
@RewriteConfiguration
public class WebHookConfiguration extends HttpConfigurationProvider
{
   @Inject
   private Downloader downloader;

   @Override
   public Configuration getConfiguration(ServletContext context)
   {
      return ConfigurationBuilder
               .begin()
               .addRule()
               .when(Path.matches("/api/v1/webhooks/cache_invalidate"))
               .perform(new HttpOperation()
               {
                  @Override
                  public void performHttp(HttpServletRewrite event, EvaluationContext context)
                  {
                     downloader.invalidateCaches();
                  }
               }.and(SendStatus.code(200)));
   }

   @Override
   public int priority()
   {
      return 0;
   }

}
