#if NET5_0_OR_GREATER
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using System.Text.Json;
#else
using Newtonsoft.Json;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Core.Composing;
#endif
using System;
using System.Collections.Generic;
using System.Linq;

namespace OpenOrClosed.Core.PropertyValueConverters
{
    public class SpecialHoursConverter : PropertyValueConverterBase
    {

#if NET5_0_OR_GREATER
        JsonSerializerOptions jsonOptions = new JsonSerializerOptions()
        {
            PropertyNameCaseInsensitive = true,
        };
        private readonly IDataTypeService dataTypeService;

        public SpecialHoursConverter(IDataTypeService dataTypeService)
        {
            this.dataTypeService = dataTypeService;
        }
#endif


        public override bool IsConverter(IPublishedPropertyType propertyType)
            => Constants.PropertyEditors.Aliases.SpecialHours == propertyType.EditorAlias;

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
            => typeof(IEnumerable<ViewModels.SpecialDaysViewModel>);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
            => PropertyCacheLevel.Element;

        public override object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object source, bool preview)
        {
            var sourceString = source?.ToString();
            if (string.IsNullOrWhiteSpace(sourceString))
            {
                return Enumerable.Empty<ViewModels.SpecialDaysViewModel>();
            }
#if NET5_0_OR_GREATER

            var data = JsonSerializer.Deserialize<IEnumerable<ViewModels.SpecialDaysViewModel>>(sourceString, jsonOptions);
            var picker = dataTypeService.GetDataType(propertyType.DataType.Id);
#else
			var data = JsonConvert.DeserializeObject<IEnumerable<ViewModels.SpecialDaysViewModel>>(sourceString);
            var picker = Current.Services.DataTypeService.GetDataType(propertyType.DataType.Id);
#endif

            var dataTypePrevalues = picker.Editor.GetConfigurationEditor().ToValueEditor(picker.Configuration);
            bool removeOldDates = dataTypePrevalues.FirstOrDefault(x => x.Key == Constants.PropertyEditors.PreValues.RemoveOldDates).Value?.ToString() == "1";

            //Only all dates in the future 
            if (removeOldDates)
            {
                return data.Where(x => x.Date.Date >= DateTime.Now.Date.Date).ToList();
            }

            return data;
        }
    }
}
