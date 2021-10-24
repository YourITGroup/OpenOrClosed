#if NET5_0_OR_GREATER
using Umbraco.Cms.Core.PropertyEditors;
#else
using Umbraco.Core.PropertyEditors;
#endif
namespace OpenOrClosed.Core.PropertyEditors
{
    public class SpecialHoursConfiguration : AbstractHoursConfiguration
    {

        [ConfigurationField("removeOldDates", "Remove Old Dates", 
            "boolean", 
            Description = "If checked, dates that have passed will be removed on save.")]
        public bool RemoveOldDates { get; set; }
    }
}
