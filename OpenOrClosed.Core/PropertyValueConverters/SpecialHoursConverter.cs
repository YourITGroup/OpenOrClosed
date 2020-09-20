using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core.Composing;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyValueConverters
{
    public class SpecialHoursConverter : PropertyValueConverterBase
    {
        public override bool IsConverter(IPublishedPropertyType propertyType)
            => Constants.PropertyEditors.Aliases.SpecialHours == propertyType.EditorAlias;

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
            => typeof(IEnumerable<ViewModels.SpecialDaysViewModel>);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
            => PropertyCacheLevel.Element;

        public override object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null)
            {
                return Enumerable.Empty<ViewModels.SpecialDaysViewModel>();
            }

            var data = JsonConvert.DeserializeObject<IEnumerable<ViewModels.SpecialDaysViewModel>>((string)source);

            var picker = Current.Services.DataTypeService.GetDataType(propertyType.DataType.Id);
            var dataTypePrevalues = picker.Editor.GetConfigurationEditor().ToValueEditor(picker.Configuration);
            bool removeOldDates = dataTypePrevalues.FirstOrDefault(x => x.Key == Constants.PropertyEditors.PreValues.RemoveOldDates).Value?.ToString() == "1";

            //Only all dates in the future 
            if (removeOldDates)
            {
                return data.Where(x => x.Date != null && x.Date.Date >= DateTime.Now.Date.Date).ToList();
            }

            return data;
        }
    }
}
