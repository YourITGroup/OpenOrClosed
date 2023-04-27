using Umbraco.Cms.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyEditors;

public abstract class AbstractHoursConfiguration
{
    [ConfigurationField("excludeTimes", "Exclude Times", 
        "boolean", 
        Description = "If checked, Times will not be available to be chosen.")]
    public bool ExcludeTimes { get; set; }

    [ConfigurationField("hoursOptional", "Hours Optional",
        "boolean",
        Description = "Make All Hours Optional")]
    public bool HoursOptional { get; set; }

    [ConfigurationField("closedHoursOptional", "Closed Hours Optional",
        "boolean",
        Description = "Make Closed Hours Optional")]
    public bool ClosedHoursOptional { get; set; }

    [ConfigurationField("time_24hr", "Time Format",
        "~/App_Plugins/OpenOrClosed/views/prevalues/timeformat.html",
        Description = "12/24 hour clock")]
    public string TimeFormat { get; set; }

    [ConfigurationField("defaultOpen", "Default Open Time",
        "~/App_Plugins/OpenOrClosed/views/timepicker.html",
        Description = "Please enter a default open time - defaults to 09:00")]
    public string DefaultOpenTime { get; set; }

    [ConfigurationField("defaultClose", "Default Close Time",
        "~/App_Plugins/OpenOrClosed/views/timepicker.html",
        Description = "Please enter a default close time - defaults to 17:00")]
    public string DefaultCloseTime { get; set; }

    [ConfigurationField("showAppointmentOnly", "Enable Appointment Only",
        "boolean",
        Description = "Show Appointment Only option for times")]
    public bool ShowAppointmentOnly { get; set; }

    [ConfigurationField("labelOpen", "Open Label",
        "textstring",
        Description = "Override the label for the Open status")]
    public string OpenLabel { get; set; }

    [ConfigurationField("labelClosed", "Closed Label",
        "textstring",
        Description = "Override the label for the Closed status")]
    public string ClosedLabel { get; set; }
}
