# Projektbeschreibung: KVMDash

| ![KvmDash Logo](src/assets/kvmdash.svg) | KVMDash ist eine Web-App, mit der du deine virtuellen Maschinen auf Linux ganz einfach verwalten kannst. Keine komplizierten Befehle – einfach starten, stoppen und den Überblick behalten. |  
|-----------------------------------------|--------------------------------------------------------------------------------------------------------------|
## Video
[![YouTube Video](https://img.youtube.com/vi/MWDK3TcuIK4/0.jpg)](https://www.youtube.com/watch?v=MWDK3TcuIK4)

## Features
### VM Verwaltung
* Erstellen, Löschen und Konfigurieren von VMs und Containern über die Weboberfläche.
* Nutzung von Vorlagen für die schnelle und standardisierte Erstellung von VMs.
### Systemmonitoring
* Echtzeitüberwachung von Ressourcen wie CPU, Arbeitsspeicher, Festplattenauslastung und weiteren wichtigen Systemmetriken.
* Übersichtliche Darstellung der Systemleistung für eine optimale Kontrolle und Fehleranalyse.
## Voraussetzung
Ein Linux-System mit:
* Installiertem KVM (Kernel-based Virtual Machine).
* Installiertem libvirt für die Verwaltung von Virtualisierungsressourcen.
* Instaliertem KVMDash-API - https://github.com/zerlix/KVMDash-API

## Installation
 TODO....

Nach erfolgreicher Installation muss User "www-data" der Gruppe libvirt und kvm hinzugefügt werden.
```bash
usermod -aG libvirt,kvm www-data
```

