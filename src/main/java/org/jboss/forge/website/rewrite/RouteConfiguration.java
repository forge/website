/*
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */
package org.jboss.forge.website.rewrite;

import javax.servlet.ServletContext;

import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.config.Direction;
import org.ocpsoft.rewrite.context.EvaluationContext;
import org.ocpsoft.rewrite.event.Rewrite;
import org.ocpsoft.rewrite.param.Transposition;
import org.ocpsoft.rewrite.servlet.config.DispatchType;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.Path;
import org.ocpsoft.rewrite.servlet.config.Redirect;
import org.ocpsoft.rewrite.servlet.config.RequestParameter;
import org.ocpsoft.rewrite.servlet.config.Resource;
import org.ocpsoft.rewrite.servlet.config.SendStatus;
import org.ocpsoft.rewrite.servlet.config.ServletMapping;
import org.ocpsoft.rewrite.servlet.config.rule.Join;

/**
 * @author <a href="mailto:lincolnbaxter@gmail.com">Lincoln Baxter, III</a>
 */
@RewriteConfiguration
public class RouteConfiguration extends HttpConfigurationProvider
{
   private final class SpacesToDashes implements Transposition<String>
   {
      @Override
      public String transpose(Rewrite event, EvaluationContext context, String value)
      {
         if (Direction.isOutbound().evaluate(event, context))
            return value.replaceAll("\\+|\\s+", "-").replaceAll("[-]+", "-").toLowerCase();
         else
            return value.replaceAll("-", " ").replaceAll("\\s+", " ");
      }
   }

   @Override
   public Configuration getConfiguration(ServletContext context)
   {
      return ConfigurationBuilder
               .begin()

               /*
                * Page specific routes
                */
               .addRule(Join.path("/").to("/faces/index.xhtml"))

               .addRule(Join.path("/document/{title}").to("/document").withChaining())
               .where("title").transposedBy(new SpacesToDashes())
               
               .addRule(Join.path("/addon/{id}").to("/addon").withChaining())

               /*
                * Block direct file access.
                */
               .addRule()
               .when(DispatchType.isRequest().and(Direction.isInbound())
                        .and(Path.matches("/{p}.xhtml"))
                        .and(Resource.exists("/{p}.xhtml"))
                        .andNot(ServletMapping.includes("/{p}")))
               .perform(SendStatus.error(404))
               .where("p").matches(".*")

               /*
                * Application Routes
                */
               .addRule(Join.path("/{p}/").to("/faces/{p}/index.xhtml").withChaining())
               .when(Resource.exists("/{p}/index.xhtml"))
               .where("p").matches(".*")

               .addRule(Join.path("/{p}").to("/faces/{p}.xhtml").withChaining())
               .when(Resource.exists("/{p}.xhtml"))
               .where("p").matches(".*")

               .addRule()
               .when(DispatchType.isRequest().and(Direction.isInbound())
                        .and(RequestParameter.exists("ticket")).and(Path.matches("/auth")))
               .perform(Redirect.temporary(context.getContextPath()))

      ;
   }

   @Override
   public int priority()
   {
      return 0;
   }

}
