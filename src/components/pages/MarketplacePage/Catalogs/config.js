const fetchResourceRefs = async () => {
  try {
    const response = await InstalledPackage.GetInstalledPackageResourceRefs(
      installedPkgRef
    );

    setResourceRefs(response.resourceRefs);
    return;
  } catch (e) {
    if (e.code !== grpc.Code.NotFound) {
      setFetchError(new FetchError('unable to fetch resource references', [e]));
      return;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
};
fetchResourceRefs();
