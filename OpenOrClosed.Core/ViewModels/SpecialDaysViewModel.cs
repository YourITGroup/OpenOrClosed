using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace OpenOrClosed.Core.ViewModels
{
    [DataContract]
    public class SpecialDaysViewModel
    {
        [DataMember(Name = "date")]
        public DateTime Date { get; set; }

        [DataMember(Name = "isOpen")]
        public bool IsOpen { get; set; }

        [DataMember(Name = "comment")]
        public string? Comment { get; set; }

        [DataMember(Name = "hoursOfBusiness")]
        public List<HoursViewModel> HoursOfBusiness { get; set; }
    }
}
