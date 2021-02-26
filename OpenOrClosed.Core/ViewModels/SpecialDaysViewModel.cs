using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace OpenOrClosed.Core.ViewModels
{
    public class SpecialDaysViewModel
    {
        //public Guid Id { get; set; }

        [JsonProperty("date")]
        public DateTime Date { get; set; }

        [JsonProperty("isOpen")]
        public bool IsOpen { get; set; }

        [JsonProperty("hoursOfBusiness")]
        public List<HoursViewModel> HoursOfBusiness { get; set; }
    }
}
