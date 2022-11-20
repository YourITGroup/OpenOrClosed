using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using OpenOrClosed.Core.ViewModels;
using OpenOrClosed.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyValueConverters
{
    public class StandardHoursConverter : PropertyValueConverterBase
    {
        public override bool IsConverter(IPublishedPropertyType propertyType)
            => StandardHoursPropertyEditor.EditorAlias == propertyType.EditorAlias;

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
            => typeof(IEnumerable<DaysViewModel>);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
            => PropertyCacheLevel.Element;

        public override object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object source, bool preview)
        {
            var sourceString = source?.ToString();
            if (string.IsNullOrWhiteSpace(sourceString))
            {
                return Enumerable.Empty<DaysViewModel>();
            }
            var data = JsonConvert.DeserializeObject<IEnumerable<DaysViewModel>>(sourceString);

            //// Go through and adjust the dates for each set of hours.
            //foreach (var day in data)
            //{
            //    if (day.IsOpen)
            //    {
            //        if (!Enum.TryParse(day.DayOfTheWeek, true, out DayOfTheWeek dotw))
            //        {
            //            dotw = DayOfTheWeek.PublicHolidays;
            //        }

            //        switch(dotw)
            //        {
            //            case DayOfTheWeek.PublicHolidays:
            //        }

            //        foreach (var hours in day.HoursOfBusiness)
            //        {
            //            hours.OpensAt = new DateTime(date.Date.Year, date.Date.Month, date.Date.Day, hours.OpensAt.Hour, hours.OpensAt.Minute, hours.OpensAt.Second);
            //            hours.ClosesAt = new DateTime(date.Date.Year, date.Date.Month, date.Date.Day, hours.ClosesAt.Hour, hours.ClosesAt.Minute, hours.ClosesAt.Second);
            //        }
            //    }
            //}

            return data;
        }
    }
}
