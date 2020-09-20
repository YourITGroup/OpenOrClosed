using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.PropertyEditors
{
    public abstract class AbstractHoursConfiguration
    {
        [ConfigurationField("time_24hr", "Time Format", "~/App_Plugins/OpenOrClosed/views/prevalues/timeformat.html", Description = "12/24 hour clock")]
        public bool TimeFormat { get; set; }

        [ConfigurationField("defaultOpen", "Default Open Time", "~/App_Plugins/OpenOrClosed/views/timepicker.html", Description = "Please enter a default open time - defaults to 09:00")]
        public string DefaultOpenTime { get; set; }

        [ConfigurationField("defaultClose", "Default Close Time", "~/App_Plugins/OpenOrClosed/views/prevalues/timepicker.html", Description = "Please enter a default close time - defaults to 17:00")]
        public string DefaultCloseTime { get; set; }

        [ConfigurationField("showAppointmentOnly", "Show Appointment Only Checkbox", "boolean", Description = "Shows or hides the 'Appointment Only' field")]
        public bool ShowAppointmentOnly { get; set; }
    }
}
