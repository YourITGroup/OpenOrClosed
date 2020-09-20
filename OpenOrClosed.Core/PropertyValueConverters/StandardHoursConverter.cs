using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyValueConverters
{
    public class StandardHoursConverter : PropertyValueConverterBase
    {
        public override bool IsConverter(IPublishedPropertyType propertyType)
            => Constants.PropertyEditors.Aliases.StandardHours == propertyType.EditorAlias;

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
            => typeof(IEnumerable<ViewModels.DaysViewModel>);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
            => PropertyCacheLevel.Element;

        public override object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null)
            {
                return Enumerable.Empty<ViewModels.DaysViewModel>();
            }

            var data = JsonConvert.DeserializeObject<IEnumerable<ViewModels.DaysViewModel>>((string)source);
            return data;
        }
    }
}
