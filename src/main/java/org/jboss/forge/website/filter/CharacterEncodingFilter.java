/**
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

package org.jboss.forge.website.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;

/**
 * Forces UTF-8 character encoding
 *
 * @author <a href="ggastald@redhat.com">George Gastaldi</a>
 */
@WebFilter(filterName = "EncodingFilter", urlPatterns = "/*")
public class CharacterEncodingFilter implements Filter
{

   private String encoding = "UTF-8";

   @Override
   public void init(FilterConfig filterConfig) throws ServletException
   {
      String param = filterConfig.getInitParameter("encoding");
      if (param != null)
      {
         encoding = param;
      }
   }

   @Override
   public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
            ServletException
   {
      request.setCharacterEncoding(encoding);
      response.setCharacterEncoding(encoding);
      chain.doFilter(request, response);
   }

   @Override
   public void destroy()
   {
   }

}
