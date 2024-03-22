<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:service {serviceClassName}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new service class';

    /**
     * @const string service dir path
     */
    public const SERVICES_PATH = 'app/Services/';

    /**
     * @var string
     */
    private $directoryPath = "";

    /**
     * @var string
     */
    private $namespace;

    /**
     * @var string
     */
    private $className;

    /**
     * @var string
     */
    private $serviceFileName;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->setParameter();

        if (!$this->className) {
            $this->error('Service Class Name invalid');

            return;
        }

        if (!$this->isExistsDirectory()) {
            $this->createDirectory();
        }

        $this->serviceFileName = self::SERVICES_PATH . $this->className . '.php';
        if ($this->isExistFiles()) {
            $this->error('Service already exist');

            return;
        }

        $this->createServiceClass();
        $this->info('Service created successfully');
    }

    /**
     *  Create service class
     *
     * @return void
     */
    public function createServiceClass(): void
    {
        $content = <<<EOD
        <?php

        namespace App\Services{$this->namespace};

        class {$this->className}
        {
            public function __construct()
            {

            }
        }
        EOD;

        file_put_contents($this->serviceFileName, $content);
    }

    /**
     * To check if a service file with the same name exists.
     *
     * @return bool
     */
    private function isExistFiles(): bool
    {
        return file_exists($this->serviceFileName);
    }

    /**
     * To check if a service directory with the same name exists.
     *
     * @return boolean
     */
    private function isExistsDirectory(): bool
    {
        return file_exists(self::SERVICES_PATH . $this->directoryPath);
    }

    /**
     * Create service directory
     *
     * @return void
     */
    private function createDirectory(): void
    {
        mkdir(self::SERVICES_PATH . $this->directoryPath, 0755, true);
    }

    private function setParameter()
    {
        $repositoryClassName = $this->argument('serviceClassName');
        if (Str::contains($repositoryClassName, '/')) {
            $this->directoryPath = Str::beforeLast($repositoryClassName, '/');
            $this->namespace = '\\' . str_replace('/', '\\', $this->directoryPath);
            $this->className = Str::afterLast($repositoryClassName, '/');
            $this->serviceFileName = self::SERVICES_PATH . $repositoryClassName . '.php';
        } else {
            $this->className = $this->argument('repositoryClassName');
            $this->serviceFileName = self::SERVICES_PATH . $repositoryClassName . '.php';
        }
    }
}
