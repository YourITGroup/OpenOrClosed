using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

namespace OpenOrClosed.Core.PropertyEditors
{
    public class StandardHoursConfigurationEditor : ConfigurationEditor<StandardHoursConfiguration>
    {

        public StandardHoursConfigurationEditor(IIOHelper ioHelper) : base(ioHelper)
        {
        }
    }
}
