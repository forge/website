package org.jboss.forge.website.model;

import javax.faces.convert.EnumConverter;
import javax.faces.convert.FacesConverter;

import org.jboss.forge.website.model.Document.Category;

@FacesConverter(value = "documentCategoryConverter")
public class DocumentCategoryConverter extends EnumConverter
{
   public DocumentCategoryConverter()
   {
      super(Category.class);
   }

}