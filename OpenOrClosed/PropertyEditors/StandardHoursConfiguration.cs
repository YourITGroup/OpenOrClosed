using Umbraco.Core.PropertyEditors;

namespace OpenOrClosed.PropertyEditors
{
    public class StandardHoursConfiguration : AbstractHoursConfiguration
    {

        [ConfigurationField("showBankHolidays", "Bank Holidays", "boolean", Description = "Shows or hides the 'Bank Holidays' option")]
        public bool ShowBankHolidays { get; set; }
    }
}
