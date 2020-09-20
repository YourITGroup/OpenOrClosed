using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.PropertyEditors
{
    public class SpecialHoursConfiguration : AbstractHoursConfiguration
    {

        [ConfigurationField("removeOldDates", "Hide Old Dates", "boolean", Description = "If checked, dates that have passed will be removed on save.")]
        public bool RemoveOldDates { get; set; }
    }
}
