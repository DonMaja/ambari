"""
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Ambari Agent

"""

from resource_management.libraries.script.script import Script
from resource_management.libraries.resources.hdfs_resource import HdfsResource
from resource_management.libraries.functions import conf_select
from resource_management.libraries.functions import hdp_select
from resource_management.libraries.functions.version import format_hdp_stack_version
from resource_management.libraries.functions.default import default
from resource_management.libraries.functions import get_kinit_path

# server configurations
config = Script.get_config()
tmp_dir = Script.get_tmp_dir()

stack_name = default("/hostLevelParams/stack_name", None)

stack_version_unformatted = str(config['hostLevelParams']['stack_version'])
hdp_stack_version = format_hdp_stack_version(stack_version_unformatted)

# New Cluster Stack Version that is defined during the RESTART of a Rolling Upgrade
version = default("/commandParams/version", None)

# hadoop default parameters
hadoop_conf_dir = conf_select.get_hadoop_conf_dir()
hadoop_bin_dir = hdp_select.get_hadoop_dir("bin")
pig_conf_dir = "/etc/pig/conf"
hadoop_home = '/usr'
pig_bin_dir = ""

# hadoop parameters for 2.2+
if Script.is_hdp_stack_greater_or_equal("2.2"):
  pig_conf_dir = "/usr/hdp/current/pig-client/conf"
  hadoop_home = hdp_select.get_hadoop_dir("home")
  pig_bin_dir = '/usr/hdp/current/pig-client/bin'

hdfs_user = config['configurations']['hadoop-env']['hdfs_user']
hdfs_principal_name = config['configurations']['hadoop-env']['hdfs_principal_name']
hdfs_user_keytab = config['configurations']['hadoop-env']['hdfs_user_keytab']
smokeuser = config['configurations']['cluster-env']['smokeuser']
smokeuser_principal = config['configurations']['cluster-env']['smokeuser_principal_name']
user_group = config['configurations']['cluster-env']['user_group']
security_enabled = config['configurations']['cluster-env']['security_enabled']
smoke_user_keytab = config['configurations']['cluster-env']['smokeuser_keytab']
kinit_path_local = get_kinit_path(default('/configurations/kerberos-env/executable_search_paths', None))
pig_env_sh_template = config['configurations']['pig-env']['content']

# not supporting 32 bit jdk.
java64_home = config['hostLevelParams']['java_home']

pig_properties = config['configurations']['pig-properties']['content']

log4j_props = config['configurations']['pig-log4j']['content']



hdfs_site = config['configurations']['hdfs-site']
default_fs = config['configurations']['core-site']['fs.defaultFS']

dfs_type = default("/commandParams/dfs_type", "")

import functools
#create partial functions with common arguments for every HdfsResource call
#to create hdfs directory we need to call params.HdfsResource in code
HdfsResource = functools.partial(
  HdfsResource,
  user=hdfs_user,
  hdfs_resource_ignore_file = "/var/lib/ambari-agent/data/.hdfs_resource_ignore",
  security_enabled = security_enabled,
  keytab = hdfs_user_keytab,
  kinit_path_local = kinit_path_local,
  hadoop_bin_dir = hadoop_bin_dir,
  hadoop_conf_dir = hadoop_conf_dir,
  principal_name = hdfs_principal_name,
  hdfs_site = hdfs_site,
  default_fs = default_fs,
  dfs_type = dfs_type
 )

