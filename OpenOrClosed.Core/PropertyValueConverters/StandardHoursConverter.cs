#if NET5_0_OR_GREATER
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using System.Text.Json;
#else
using Newtonsoft.Json;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
#endif
using System;
using System.Collections.Generic;
using System.Linq;

namespace OpenOrClosed.Core.PropertyValueConverters
{
    public class StandardHoursConverter : PropertyValueConverterBase
    {
#if NET5_0_OR_GREATER
        JsonSerializerOptions jsonOptions = new JsonSerializerOptions()
        {
            PropertyNameCaseInsensitive = true,
        };
#endif

        public override bool IsConverter(IPublishedPropertyType propertyType)
            => Constants.PropertyEditors.Aliases.StandardHours == propertyType.EditorAlias;

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
            => typeof(IEnumerable<ViewModels.DaysViewModel>);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
            => PropertyCacheLevel.Element;

        public override object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object source, bool preview)
        {
            var sourceString = source?.ToString();
            if (string.IsNullOrWhiteSpace(sourceString))
            {
                return Enumerable.Empty<ViewModels.DaysViewModel>();
            }
#if NET5_0_OR_GREATER

            var data = JsonSerializer.Deserialize<IEnumerable<ViewModels.DaysViewModel>>(sourceString, jsonOptions);
#else
			var data = JsonConvert.DeserializeObject<IEnumerable<ViewModels.DaysViewModel>>(sourceString);
#endif
            return data;
        }
    }
}
