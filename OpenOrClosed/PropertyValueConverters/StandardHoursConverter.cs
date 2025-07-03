using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Newtonsoft.Json;
using OpenOrClosed.ViewModels;
using OpenOrClosed.PropertyEditors;

namespace OpenOrClosed.PropertyValueConverters;

public class StandardHoursConverter : PropertyValueConverterBase
{
    public override bool IsConverter(IPublishedPropertyType propertyType)
        => StandardHoursPropertyEditor.EditorAlias == propertyType.EditorAlias;

    public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
        => typeof(IEnumerable<DaysViewModel>);

    public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        => PropertyCacheLevel.Element;

    public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview)
    {
        var sourceString = source?.ToString();
        if (string.IsNullOrWhiteSpace(sourceString))
        {
            return Enumerable.Empty<DaysViewModel>();
        }
        var data = JsonConvert.DeserializeObject<IEnumerable<DaysViewModel>>(sourceString);
        if (data is null)
        {
            return data;
        }

        // Go through and adjust the dates for each set of hours.
        var dayOfWeek = DateTime.Now.Date.DayOfWeek;
        foreach (var day in data)
        {
           if (day.IsOpen)
           {
                if (day.Day is not null) {
                    var offset = day.Day - dayOfWeek ?? 0;
                    if (day.Day == DayOfWeek.Sunday) {
                        // Need to add a week to account for Monday being the first in the list.
                        offset += 7;
                    }
                    foreach(var set in day.HoursOfBusiness) {
                        set.OpensAt = set.OpensAt?.AddDays(offset);
                        set.ClosesAt = set.ClosesAt?.AddDays(offset);
                    }
                }
           }
        }

        return data;
    }
}
