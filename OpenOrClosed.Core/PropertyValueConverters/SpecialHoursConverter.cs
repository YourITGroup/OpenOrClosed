using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using OpenOrClosed.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyValueConverters;

public class SpecialHoursConverter : PropertyValueConverterBase
{
    private readonly IDataTypeService dataTypeService;

    public SpecialHoursConverter(IDataTypeService dataTypeService)
    {
        this.dataTypeService = dataTypeService;
    }

    public override bool IsConverter(IPublishedPropertyType propertyType)
        => SpecialHoursPropertyEditor.EditorAlias == propertyType.EditorAlias;

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
        var data = JsonConvert.DeserializeObject<IEnumerable<ViewModels.SpecialDaysViewModel>>(sourceString);
        var picker = dataTypeService.GetDataType(propertyType.DataType.Id);

        var dataTypePrevalues = picker.Editor.GetConfigurationEditor().ToValueEditor(picker.Configuration);
        bool removeOldDates = dataTypePrevalues.FirstOrDefault(x => x.Key == Constants.PropertyEditors.PreValues.RemoveOldDates).Value?.ToString() == "1";

        var currDate = DateTime.Now.Date.Date;

        // Go through and adjust the dates for each set of hours.
        foreach (var date in data)
        {
            if (removeOldDates)
            {
                if (date.Date.Date < currDate)
                {
                    continue;
                }
            }

            foreach (var hours in date.HoursOfBusiness)
            {
                if (hours.OpensAt != null)
                {
                    hours.OpensAt = new DateTime(date.Date.Year, date.Date.Month, date.Date.Day, hours.OpensAt?.Hour ?? 0, hours.OpensAt?.Minute ?? 0, hours.OpensAt?.Second ?? 0);
                }
                if (hours.ClosesAt != null)
                {
                    hours.ClosesAt = new DateTime(date.Date.Year, date.Date.Month, date.Date.Day, hours.ClosesAt?.Hour ?? 0, hours.ClosesAt?.Minute ?? 0, hours.ClosesAt?.Second ?? 0);
                }
            }
        }

        //Only all dates in the future 
        if (removeOldDates)
        {
            return data.Where(x => x.Date.Date >= DateTime.Now.Date).ToList();
        }

        return data;
    }
}
