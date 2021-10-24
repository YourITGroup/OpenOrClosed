#if NET5_0_OR_GREATER
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
#else
using Umbraco.Core.PropertyEditors;
#endif
namespace OpenOrClosed.Core.PropertyEditors
{
#if NET5_0_OR_GREATER
    public class SpecialHoursConfigurationEditor : ConfigurationEditor<SpecialHoursConfiguration>
#else
    public class SpecialHoursConfigurationEditor : ConfigurationEditor<StandardHoursConfiguration>
#endif
    {

#if NET5_0_OR_GREATER
        public SpecialHoursConfigurationEditor(IIOHelper ioHelper) : base(ioHelper)
        {
        }
#endif
    }
}
