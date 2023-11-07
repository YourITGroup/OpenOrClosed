using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Manifest;

namespace OpenOrClosed;

public class OpenOrClosedManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        var manifest = new PackageManifest()
            {
                PackageId = "OpenOrClosed",
                PackageName = "Open Or Closed",
                Version = FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).ProductVersion?.Split('+')[0],
                BundleOptions = BundleOptions.Default,
                AllowPackageTelemetry = true,
                Scripts = new string[]
                {
                    "/App_Plugins/OpenOrClosed/js/TimePicker.controller.js",
                    "/App_Plugins/OpenOrClosed/js/StandardHours.controller.js",
                    "/App_Plugins/OpenOrClosed/js/SpecialHours.controller.js"
                },
                Stylesheets = new string[]
                {
                    "/App_Plugins/OpenOrClosed/css/OpenOrClosed.css"
                },
            };

            manifests.Add(manifest);
    }
}

public class ManifestLoaderManifestComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.ManifestFilters().Append<OpenOrClosedManifestFilter>();
    }
}