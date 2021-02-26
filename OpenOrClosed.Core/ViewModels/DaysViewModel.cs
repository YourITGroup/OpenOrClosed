using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace OpenOrClosed.Core.ViewModels
{
    public class DaysViewModel
    {
        //public Guid Id { get; set; }
        [JsonProperty("dayOfTheWeek")]
        public string DayOfTheWeek { get; set; }

        [JsonProperty("isOpen")]
        public bool IsOpen { get; set; }
        
        [JsonProperty("hoursOfBusiness")]
        public List<HoursViewModel> HoursOfBusiness { get; set; }
    }
}
