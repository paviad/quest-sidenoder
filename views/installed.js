console.log('ONLOAD INSTALLED');

ipcRenderer.on('get_installed', (event, arg) => {
  console.log('get_installed msg came ! ', arg.success);
  if (arg.success) {
    drawInstalledApps(arg.apps);
    $('#updateBadge').show();
  }

  $('#processingModal').modal('hide');
});

ipcRenderer.on('get_installed_with_updates', (event, arg) => {
  console.log('get_installed msg came ! ', arg.success);
  if (arg.success) {
    drawInstalledApps(arg.apps);
    $('#updateBadge').hide();
  }

  $('#processingModal').modal('hide');
});

ipcRenderer.on('uninstall', (event, arg) => {
  console.log('uninstall msg came ! ');
  $('#appToolModal').modal('hide');
  loadInclude('installed_include.twig');
});

function getUpdates() {
  $('#processingModal').modal('show');
  ipcRenderer.send('get_installed_with_updates', '');
}

function update(elem) {
  $(elem).html(`<i class="fa fa-refresh fa-spin"></i> Please wait`);
  ipcRenderer.send('folder_install', { path: elem.dataset.path, update: true });
}

function uninstall(elem, packageName) {
  $(elem).html(`<i class="fa fa-refresh fa-spin"></i> Please wait`);
  ipcRenderer.send('uninstall', packageName);
}

function startApp(packageName) {
  ipcRenderer.send('start_app', packageName);
  // ipcRenderer.send('get_activities', packageName);
}

function appTools(packageName) {
  $('#processingModal').modal('show');
  loadInclude('modals/app_tools.twig', 'apptoolsmodaldiv', () => {
    ipcRenderer.send('app_tools', packageName);
  });
}

function drawInstalledApps(apps) {
  console.log('drawInstalledApps', apps.length);
  let rows = '';
  for (const app of apps) {
    // console.log('list app', app);
    row = `<tr><td class="text-center" style="width: 250px;vertical-align:middle;"><img style="max-height:80px" src="${app.imagePath}"/></td>
      <td style="vertical-align:middle;font-weight: bolder; font-size: large">${app.simpleName}
      <br/><small>${app.packageName}<br/>VersionCode: ${app.versionCode}</small></td><td style="vertical-align:middle;">`;

    if (!app.update) {
      row += `<a onclick="startApp('${app.packageName}')" class="adbdev btn btn-info"> <i class="fa fa-play"></i> Launch</a> `;
      row += `<a onclick="uninstall(this, '${app.packageName}')" class="adbdev btn btn-danger"> <i class="fa fa-trash-o"></i> Uninstall</a> `;
      // row += `<a onclick="appTools('${app.packageName}')" class="adbdev btn btn-primary"> <i class="fa fa-cog"></i> Tools</a> `;
    }
    else {
      row += `<a data-path="${app.update.path}" onclick='update(this)' class="btn btn-info btn-sm">
        <i class="fa fa-upload"></i> Update to
        <br/> v.${app.update.versionCode}</a>`;
    }

    row += `<td></tr>`;
    rows += row;
  }

  $('#listTable')[0].innerHTML = rows;
}


