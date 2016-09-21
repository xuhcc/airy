require 'yaml'


Vagrant.configure("2") do |config|

  settings = YAML::load_file("vagrant/default_settings.yml")
  begin
    settings.merge!(YAML::load_file("vagrant/settings.yml"))
  rescue Errno::ENOENT
  end

  config.vm.box = "debian/contrib-jessie64"
  config.vm.hostname = "airy-server"

  config.vm.network "forwarded_port", guest: 5432, host: settings['vm']['ports']['postgresql']

  config.vm.provider "virtualbox" do |vb|
    vb.name = "Airy VM"
    vb.memory = settings['vm']['memory']
    vb.cpus = settings['vm']['cpus']
  end

  config.vm.synced_folder "vagrant/salt/roots/", "/srv/"

  config.vm.provision :salt do |salt|
    salt.masterless = true
    salt.minion_config = "vagrant/salt/minion.conf"
    salt.run_highstate = true
    salt.verbose = true

    salt.pillar(settings['pillar'])
  end

end
