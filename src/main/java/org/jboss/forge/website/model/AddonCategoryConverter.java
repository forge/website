package org.jboss.forge.website.model;

import javax.faces.convert.EnumConverter;
import javax.faces.convert.FacesConverter;

import org.jboss.forge.website.model.Addon.Category;

@FacesConverter(value = "addonCategoryConverter")
public class AddonCategoryConverter extends EnumConverter
{
   public AddonCategoryConverter()
   {
      super(Category.class);
   }

}