require 'yaml'
require 'vagrant/util/deep_merge'

Vagrant.configure("2") do |config|

  settings = YAML::load_file("vagrant/default_settings.yaml")
  begin
    settings = Vagrant::Util::DeepMerge.deep_merge(
      settings,
      YAML::load_file("vagrant/settings.yaml"))
  rescue Errno::ENOENT
  end

  config.vm.box = "debian/contrib-stretch64"
  config.vm.box_version = "9.2.0"
  config.vm.hostname = "airy-vm"

  config.vm.network "forwarded_port", guest: 5432, host: settings['vm']['ports']['postgresql']

  config.vm.provider "virtualbox" do |vb|
    vb.name = "Airy VM"
    vb.memory = settings['vm']['memory']
    vb.cpus = settings['vm']['cpus']
  end

  config.vm.synced_folder "vagrant/salt/states/", "/srv/salt/"

  config.vm.provision :salt do |salt|
    salt.masterless = true
    salt.minion_config = "vagrant/salt/minion.conf"
    salt.run_highstate = true
    salt.verbose = true

    salt.pillar(settings['pillar'])
  end

end
