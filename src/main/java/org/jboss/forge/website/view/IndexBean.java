/**
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

package org.jboss.forge.website.view;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.jboss.forge.website.model.Addon;
import org.jboss.forge.website.model.AddonStatus;
import org.jboss.forge.website.model.Addon_;

/**
 *
 * @author <a href="ggastald@redhat.com">George Gastaldi</a>
 */
@Named
@Stateless
@LocalBean
public class IndexBean
{
   @PersistenceContext
   EntityManager entityManager;

   public List<Addon> getMainAddons()
   {
      CriteriaBuilder builder = entityManager.getCriteriaBuilder();
      CriteriaQuery<Addon> criteria = builder.createQuery(Addon.class);
      Root<Addon> root = criteria.from(Addon.class);
      TypedQuery<Addon> query = this.entityManager.createQuery(criteria
               .select(root).where(builder.equal(root.get(Addon_.status), AddonStatus.APPROVED))
               .orderBy(builder.desc(root.get(Addon_.creationDate))));
      query.setMaxResults(3);
      return query.getResultList();
   }
}
