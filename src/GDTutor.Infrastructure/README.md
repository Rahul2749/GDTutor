# Infrastructure boundary

Concrete adapters implement Application capabilities; references remain inward to Application and Domain. Foundation/InMemoryFoundationSampleSource is an immutable local wiring example, with no I/O or persistence. It cannot report a database/provider healthy or perform a real business operation.

No EF/Npgsql, mappings, migrations, payment/storage SDK or worker is installed. PostgreSQL structure review remains mandatory at 2.4.1. See docs/architecture/BACKEND-SERVICES-CONFIGURATION.md for current checks and replacement behavior.
