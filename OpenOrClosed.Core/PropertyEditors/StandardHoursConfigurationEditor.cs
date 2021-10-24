#if NET5_0_OR_GREATER
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
#else
using Umbraco.Core.PropertyEditors;
#endif

namespace OpenOrClosed.Core.PropertyEditors
{
#if NET5_0_OR_GREATER
    public class StandardHoursConfigurationEditor : ConfigurationEditor<StandardHoursConfiguration>
#else
    public class StandardHoursConfigurationEditor : ConfigurationEditor<StandardHoursConfiguration>
#endif
    {

#if NET5_0_OR_GREATER
        public StandardHoursConfigurationEditor(IIOHelper ioHelper) : base(ioHelper)
        {
        }
#endif
    }
}
