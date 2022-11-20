using Umbraco.Cms.Core.PropertyEditors;
namespace OpenOrClosed.Core.PropertyEditors
{
    public class SpecialHoursConfiguration : AbstractHoursConfiguration
    {

        [ConfigurationField("removeOldDates", "Remove Old Dates", 
            "boolean", 
            Description = "If checked, dates that have passed will be removed on save.")]
        public bool RemoveOldDates { get; set; }

        [ConfigurationField("defaultToClosed", "Default to Closed",
            "boolean",
            Description = "If checked, specified dates will default to Closed instead of Open")]
        public bool DefaultToClosed { get; set; }
    }
}
