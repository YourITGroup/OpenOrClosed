﻿using Umbraco.Cms.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyEditors;

public class StandardHoursConfiguration : AbstractHoursConfiguration
{
    [ConfigurationField("showBankHolidays", "Bank Holidays",
        "boolean",
        Description = "Show Bank Holidays Option")]
    public bool ShowBankHolidays { get; set; }

    [ConfigurationField("labelBankHolidays", "Bank Holiday Label",
        "textstring",
        Description = "Override the label for the BAnk Holiday item")]
    public string BankHolidayLabel { get; set; }
}
