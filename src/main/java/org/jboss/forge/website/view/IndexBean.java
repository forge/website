/**
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

package org.jboss.forge.website.view;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.jboss.forge.website.model.Addon;
import org.jboss.forge.website.service.RepositoryService;

/**
 * @author <a href="mailto:lincolnbaxter@gmail.com">Lincoln Baxter, III</a>
 * @author <a href="ggastald@redhat.com">George Gastaldi</a>
 */
@Named
public class IndexBean
{

   @Inject
   private RepositoryService service;

   public List<Addon> getMainAddons()
   {
      return service.getRandomCommunityAddons(3);
   }
}
