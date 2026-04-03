// patch-bundle-csv restores spec.customresourcedefinitions and spec.install.spec
// in the bundle CSV from the base CSV, since operator-sdk generate bundle
// overwrites them. Run from operator directory.
package main

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

func main() {
	bundlePath := "bundle/manifests/ocp-secrets-management-operator.clusterserviceversion.yaml"
	basePath := "config/manifests/bases/ocp-secrets-management-operator.clusterserviceversion.yaml"

	bundleBuf, err := os.ReadFile(bundlePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "read bundle CSV: %v\n", err)
		os.Exit(1)
	}
	baseBuf, err := os.ReadFile(basePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "read base CSV: %v\n", err)
		os.Exit(1)
	}

	var bundle, base map[string]interface{}
	if err := yaml.Unmarshal(bundleBuf, &bundle); err != nil {
		fmt.Fprintf(os.Stderr, "parse bundle CSV: %v\n", err)
		os.Exit(1)
	}
	if err := yaml.Unmarshal(baseBuf, &base); err != nil {
		fmt.Fprintf(os.Stderr, "parse base CSV: %v\n", err)
		os.Exit(1)
	}

	specB, ok := bundle["spec"].(map[string]interface{})
	if !ok {
		fmt.Fprintf(os.Stderr, "bundle CSV: missing or invalid spec\n")
		os.Exit(1)
	}
	specBase, ok := base["spec"].(map[string]interface{})
	if !ok {
		fmt.Fprintf(os.Stderr, "base CSV: missing or invalid spec\n")
		os.Exit(1)
	}

	// Restore customresourcedefinitions and install.spec from base
	if crd, ok := specBase["customresourcedefinitions"]; ok {
		specB["customresourcedefinitions"] = crd
	}
	install, ok := specBase["install"].(map[string]interface{})
	if ok {
		if installSpec, ok := install["spec"]; ok {
			if specB["install"] == nil {
				specB["install"] = make(map[string]interface{})
			}
			specB["install"].(map[string]interface{})["spec"] = installSpec
		}
	}

	out, err := yaml.Marshal(bundle)
	if err != nil {
		fmt.Fprintf(os.Stderr, "marshal bundle CSV: %v\n", err)
		os.Exit(1)
	}
	if err := os.WriteFile(bundlePath, out, 0644); err != nil {
		fmt.Fprintf(os.Stderr, "write bundle CSV: %v\n", err)
		os.Exit(1)
	}
}
