using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyEditors
{
    public class StandardHoursConfiguration : AbstractHoursConfiguration
    {

        [ConfigurationField("showBankHolidays", "Bank Holidays", 
            "boolean",
            Description = "Show Bank Holidays Option")]
        public bool ShowBankHolidays { get; set; }
    }
}
